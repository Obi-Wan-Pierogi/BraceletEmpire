using BraceletEmpire.Server.Models;
using BraceletEmpire.Server.Data;
using BraceletEmpire.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BraceletEmpire.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly BraceletEmpireServerContext _context;
        private readonly IEmailService _emailService;

        public OrderController(BraceletEmpireServerContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null)
            {
                return BadRequest("Invalid order data.");
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Send email to customer and business
            await _emailService.SendOrderEmail(order);

            return Ok(order.OrderId);
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }
    }
}