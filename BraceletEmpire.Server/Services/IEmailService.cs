using BraceletEmpire.Server.Models;

namespace BraceletEmpire.Server.Services
{
    public interface IEmailService
    {
        Task SendOrderEmail(Order order);
    }
}
