namespace BraceletEmpire.Server.DTOs
{
    public class CreateItemDto
    {
        public string ItemName { get; set; } = default!;
        public string ItemDescription { get; set; } = default!;
        public decimal ItemPrice { get; set; } = default!;
        public string ItemType { get; set; } = default!;
        public string? BraceletSpecificAttribute { get; set; }
        public string? KeychainSpecificAttribute { get; set; }
    }
}
