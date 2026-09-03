import type { Item } from '../types';

export class WhatsAppService {
  /**
   * Generates a 1-tap WhatsApp share link for posting an item announcement into a neighborhood group chat.
   */
  static getGroupShareUrl(item: Item, appBaseUrl = window.location.origin): string {
    const itemUrl = `${appBaseUrl}/?item=${item.id}`;
    const text = encodeURIComponent(
      `🎁 *Free to Neighbor (Buy Nothing)*\n\n` +
      `*${item.title}*\n` +
      `📍 ${item.neighborhood} (${item.distance})\n` +
      `📝 ${item.description.slice(0, 100)}${item.description.length > 100 ? '...' : ''}\n\n` +
      `👉 *Check availability & claim here:* ${itemUrl}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  }

  /**
   * Formats a clean, ready-to-paste announcement for Facebook Groups.
   * Solves Meta's restriction by giving neighbors a 1-click copy with live claim link.
   */
  static formatFacebookPostText(item: Item, appBaseUrl = window.location.origin): string {
    const itemUrl = `${appBaseUrl}/?item=${item.id}`;
    return (
      `🎁 Giving: ${item.title}\n\n` +
      `📍 Location: ${item.neighborhood} (${item.distance})\n` +
      `📝 Condition: ${item.description}\n\n` +
      `👉 To claim or check if still available, click here:\n${itemUrl}`
    );
  }

  /**
   * 1-Click Copy formatted post and open the neighborhood's Facebook Group.
   */
  static async copyAndOpenFacebookGroup(
    item: Item,
    groupUrl = 'https://www.facebook.com/groups/feed/',
    appBaseUrl = window.location.origin
  ): Promise<boolean> {
    const text = this.formatFacebookPostText(item, appBaseUrl);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback if clipboard api is restricted
    }
    window.open(groupUrl, '_blank', 'noopener,noreferrer');
    return true;
  }

  /**
   * Generates standard Facebook web share dialog URL for the item link.
   */
  static getFacebookShareUrl(item: Item, appBaseUrl = window.location.origin): string {
    const itemUrl = encodeURIComponent(`${appBaseUrl}/?item=${item.id}`);
    return `https://www.facebook.com/sharer/sharer.php?u=${itemUrl}`;
  }

  /**
   * Generates a 1-tap WhatsApp direct message link for a requester to message the giver with their proposed pickup window.
   */
  static getDirectClaimUrl(item: Item, proposedTime: string, giverPhone = '15554821000'): string {
    const cleanPhone = giverPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hi ${item.giverName.split(' ')[0]}! I saw your "${item.title}" on Buy Nothing.\n\n` +
      `I'd love to pick it up! I'm available: *${proposedTime}*.\n` +
      `Is this time good for you?`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  /**
   * Generates a 1-tap WhatsApp link for the giver to safely send the porch pickup address to the chosen neighbor.
   */
  static getSendPorchAddressUrl(
    item: Item,
    address: string,
    instructions: string,
    recipientPhone = '15551934000'
  ): string {
    const cleanPhone = recipientPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hi! You've been chosen for the *${item.title}* on Buy Nothing! 🎉\n\n` +
      `📍 *Porch Pickup Address:*\n${address}\n\n` +
      `📋 *Instructions:*\n${instructions}\n\n` +
      `Please reply when you are on your way!`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  /**
   * Parses incoming webhook events from the official WhatsApp Cloud API.
   * Enables neighbors to text "CLAIM 5-7pm" or "ON MY WAY" directly from WhatsApp.
   */
  static parseIncomingWebhook(body: any): {
    senderPhone?: string;
    senderName?: string;
    messageText?: string;
    action?: 'claim' | 'on_the_way' | 'picked_up' | 'chat';
  } {
    try {
      const entry = body?.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];
      const contact = value?.contacts?.[0];

      if (!message) return {};

      const text = message.text?.body?.trim() || '';
      const lower = text.toLowerCase();

      let action: 'claim' | 'on_the_way' | 'picked_up' | 'chat' = 'chat';
      if (lower.startsWith('claim')) action = 'claim';
      else if (lower.includes('on my way') || lower.includes('on the way')) action = 'on_the_way';
      else if (lower.includes('picked up') || lower.includes('got it')) action = 'picked_up';

      return {
        senderPhone: message.from,
        senderName: contact?.profile?.name || 'Neighbor',
        messageText: text,
        action,
      };
    } catch {
      return {};
    }
  }
}
