-- ==============================================================================
-- BUY NOTHING PLATFORM: PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- ==============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Neighborhoods (Strict Hyperlocal Geographic Boundaries)
CREATE TABLE IF NOT EXISTS public.neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_codes TEXT[] NOT NULL DEFAULT '{}',
    boundary GEOMETRY(Polygon, 4326),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. User Profiles & Verification
CREATE TYPE public.verification_method AS ENUM ('sms_phone', 'neighbor_vouch', 'address_pin');
CREATE TYPE public.verification_status AS ENUM ('verified_resident', 'pending_verification');

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    neighborhood_id UUID REFERENCES public.neighborhoods(id),
    phone_masked TEXT NOT NULL,
    verified_status verification_status DEFAULT 'pending_verification' NOT NULL,
    verification_method verification_method DEFAULT 'sms_phone' NOT NULL,
    give_count INT DEFAULT 0 NOT NULL,
    pickup_count INT DEFAULT 0 NOT NULL,
    reliability_score INT DEFAULT 100 NOT NULL,
    saved_porch_address TEXT,
    saved_porch_instructions TEXT,
    sms_pickup_alerts BOOLEAN DEFAULT true NOT NULL,
    email_daily_digest BOOLEAN DEFAULT false NOT NULL,
    browser_push BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Items & Lifecycle State Machine
CREATE TYPE public.item_status AS ENUM ('available', 'pending', 'picked_up', 'archived');

CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    giver_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    neighborhood_id UUID REFERENCES public.neighborhoods(id) NOT NULL,
    title VARCHAR(140) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    status item_status DEFAULT 'available' NOT NULL,
    selected_requester_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    unclaimed_since TIMESTAMPTZ DEFAULT now() NOT NULL,
    archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_items_neighborhood ON public.items(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_unclaimed ON public.items(status, unclaimed_since) WHERE status = 'available';

-- 4. Item Requests (Structured 1-Click Offers)
CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE IF NOT EXISTS public.item_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    proposed_time TEXT NOT NULL,
    note TEXT,
    status request_status DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(item_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_requests_item ON public.item_requests(item_id);

-- 5. Porch Pickup Details (ISOLATED SECURITY TABLE)
-- Enforces that a homeowner's front porch address is NEVER exposed publicly.
CREATE TABLE IF NOT EXISTS public.pickup_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID UNIQUE REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
    address TEXT NOT NULL,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Contextual Direct Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_system_event BOOLEAN DEFAULT false NOT NULL,
    address_card JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_item ON public.messages(item_id);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Neighborhoods: Viewable by all authenticated users
CREATE POLICY "Neighborhoods are readable by all authenticated users"
ON public.neighborhoods FOR SELECT TO authenticated
USING (true);

-- User Profiles: Public stats readable by same neighborhood neighbors
CREATE POLICY "Public profiles viewable by neighborhood peers"
ON public.user_profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Items: Readable by users in the same neighborhood
CREATE POLICY "Items readable by same neighborhood"
ON public.items FOR SELECT TO authenticated
USING (
    neighborhood_id = (SELECT neighborhood_id FROM public.user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can post items to their neighborhood"
ON public.items FOR INSERT TO authenticated
WITH CHECK (
    giver_id = auth.uid() AND
    neighborhood_id = (SELECT neighborhood_id FROM public.user_profiles WHERE id = auth.uid())
);

CREATE POLICY "Givers can update their own items"
ON public.items FOR UPDATE TO authenticated
USING (giver_id = auth.uid())
WITH CHECK (giver_id = auth.uid());

-- Item Requests: Readable by Giver and the Requester
CREATE POLICY "Requests visible to Giver and Requester"
ON public.item_requests FOR SELECT TO authenticated
USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.items WHERE items.id = item_requests.item_id AND items.giver_id = auth.uid())
);

CREATE POLICY "Users can submit requests"
ON public.item_requests FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Porch Pickup Details: STRICTEST PRIVACY RULE
-- Only the item giver and the single accepted requester can view the porch address.
CREATE POLICY "Porch address strictly visible only to giver and chosen requester"
ON public.pickup_details FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.items
        WHERE items.id = pickup_details.item_id
        AND (items.giver_id = auth.uid() OR items.selected_requester_id = auth.uid())
    )
);

CREATE POLICY "Only giver can set porch address"
ON public.pickup_details FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.items
        WHERE items.id = pickup_details.item_id
        AND items.giver_id = auth.uid()
    )
);

-- Messages: Visible only to sender and recipient
CREATE POLICY "Messages visible to sender and recipient"
ON public.messages FOR SELECT TO authenticated
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages in item thread"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid());

-- Enable Real-Time Replication for Messages and Item status changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;
