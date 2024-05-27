using BraceletEmpire.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BraceletEmpire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        [HttpPost("sendOrderEmail")]
        public async Task<IActionResult> SendOrderEmail([FromBody] OrderDetails orderDetails)
        {
            var fromAddress = new MailAddress("your-email@example.com", "Your Name");
            var toAddress = new MailAddress("recipient@example.com", "Recipient Name");
            const string fromPassword = "your-email-password";
            const string subject = "New Order";
            string body = $"Name: {orderDetails.Name}\nAddress: {orderDetails.Address}\n\nOrder Details:\n";

            foreach (var item in orderDetails.CartItems)
            {
                body += $"{item.ItemName} - {item.Quantity} x {item.ItemPrice}\n";
            }

            var smtp = new SmtpClient
            {
                Host = "smtp.example.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                await smtp.SendMailAsync(message);
            }

            return Ok(new { message = "Order email sent successfully!" });
        }
    }
}