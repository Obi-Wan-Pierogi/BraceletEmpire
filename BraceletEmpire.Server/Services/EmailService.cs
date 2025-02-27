using BraceletEmpire.Server.Models;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BraceletEmpire.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IConfiguration configuration)
        {
            _smtpSettings = configuration.GetSection("SmtpSettings").Get<SmtpSettings>();
        }

        public async Task SendOrderEmail(Order order)
        {
            var fromAddress = new MailAddress(_smtpSettings.FromEmail, "Bracelet Empire");
            var toCustomerAddress = new MailAddress(order.Email, order.Name);
            var toBusinessAddress = new MailAddress(_smtpSettings.BusinessEmail, "Bracelet Empire");

            string subject = $"Bracelet Empire Order {order.OrderId}";
            string body = GenerateEmailBody(order);

            var smtp = new SmtpClient
            {
                Host = _smtpSettings.Host,
                Port = _smtpSettings.Port,
                EnableSsl = _smtpSettings.EnableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, _smtpSettings.Password)
            };

            var customerMessage = new MailMessage(fromAddress, toCustomerAddress)
            {
                Subject = subject,
                Body = body
            };

            var businessMessage = new MailMessage(fromAddress, toBusinessAddress)
            {
                Subject = subject,
                Body = body
            };

            await smtp.SendMailAsync(customerMessage);
            await smtp.SendMailAsync(businessMessage);
        }

        private string GenerateEmailBody(Order order)
        {
            var itemsList = string.Join("\n", order.Items.Select(i => $"{i.ItemName} - {i.Quantity} x {i.ItemPrice}"));
            return $@"
            Order ID: {order.OrderId}
            Name: {order.Name}
            Email: {order.Email}
            Phone: {order.Phone}
            Address: {order.StreetAddress}, {order.City}, {order.State}, {order.Zip}
            Payment Method: {order.PaymentMethod}

            Items:
            {itemsList}

            Total: ${order.Items.Sum(i => i.ItemPrice * i.Quantity)}
            ";
        }
    }
}