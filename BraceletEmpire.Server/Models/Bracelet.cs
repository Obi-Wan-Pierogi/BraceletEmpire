using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace BraceletEmpire.Server.Models
{
    public class Bracelet : Item
    {
        public string BraceletSpecificAttribute { get; set; } = default!;
    }
}
