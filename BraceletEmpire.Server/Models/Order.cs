namespace BraceletEmpire.Server.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ?Phone { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string PaymentMethod { get; set; }

        // Navigation property for the related items
        public ICollection<Item> Items { get; set; } = new List<Item>();


    }
}
