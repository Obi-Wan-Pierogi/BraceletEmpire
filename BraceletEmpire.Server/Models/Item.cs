namespace BraceletEmpire.Server.Models
{
    public class Item
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; } = default!;
        public string ItemDescription { get; set; } = default!;
        public string ImageUrl { get; set; } = default!;
        public decimal ItemPrice { get; set; } = default!;
        public string ItemType { get; set; } = default!;
        public int Quantity { get; set; }

        // Foreign key to the related order
        public int? OrderId { get; set; }
        public Order Order { get; set; }
    }
}
