export interface CreateItemDto {
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  itemType: string;
  braceletSpecificAttribute?: string;
  keychainSpecificAttribute?: string;
}
