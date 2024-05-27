import { Item } from './interfaces/item';
import { Bracelet } from './interfaces/bracelet';
import { Keychain } from './interfaces/keychain';

export function isBracelet(item: Item): item is Bracelet {
  return item.itemType === 'Bracelet';
}

export function isKeychain(item: Item): item is Keychain {
  return item.itemType === 'Keychain';
}
