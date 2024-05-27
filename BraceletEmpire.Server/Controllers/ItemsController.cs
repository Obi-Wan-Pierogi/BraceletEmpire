using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BraceletEmpire.Server.Data;
using BraceletEmpire.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BraceletEmpire.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly BraceletEmpireServerContext _context;

        public ItemsController(BraceletEmpireServerContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetItems()
        {
            var items = await _context.Items
                .Select(item => new
                {
                    item.ItemId,
                    item.ItemName,
                    item.ItemDescription,
                    item.ImageUrl,
                    item.ItemPrice,
                    item.ItemType,
                    BraceletSpecificAttribute = item is Bracelet ? ((Bracelet)item).BraceletSpecificAttribute : null,
                    KeychainSpecificAttribute = item is Keychain ? ((Keychain)item).KeychainSpecificAttribute : null
                })
                .ToListAsync();

            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, Item item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Item>> PostItem(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }
    }
}
