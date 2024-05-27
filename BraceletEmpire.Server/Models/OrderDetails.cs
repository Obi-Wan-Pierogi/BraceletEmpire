namespace BraceletEmpire.Server.Models
{
    public class OrderDetails
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public Item[] CartItems { get; set; }
    }
}
