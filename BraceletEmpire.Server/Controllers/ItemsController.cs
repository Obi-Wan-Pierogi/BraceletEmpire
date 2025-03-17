using BraceletEmpire.Server.DTOs;
using BraceletEmpire.Server.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BraceletEmpire.Server.Data;
using System;
using System.IO;
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
        private readonly IWebHostEnvironment _env;

        public ItemsController(BraceletEmpireServerContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
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

        // Get item by id
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
        public async Task<IActionResult> PutItem(int id, [FromForm] CreateItemDto itemDto, [FromForm] IFormFile? image = null)
        {
            // Get the existing item
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            // Update basic item properties
            item.ItemName = itemDto.ItemName;
            item.ItemDescription = itemDto.ItemDescription;
            item.ItemPrice = itemDto.ItemPrice;

            // Update specific attributes based on item type
            if (item is Bracelet bracelet && itemDto.ItemType == "Bracelet")
            {
                bracelet.BraceletSpecificAttribute = itemDto.BraceletSpecificAttribute ?? bracelet.BraceletSpecificAttribute;
            }
            else if (item is Keychain keychain && itemDto.ItemType == "Keychain")
            {
                keychain.KeychainSpecificAttribute = itemDto.KeychainSpecificAttribute ?? keychain.KeychainSpecificAttribute;
            }

            // Handle image update if provided
            if (image != null && image.Length > 0)
            {
                // Delete old image file if it exists
                if (!string.IsNullOrEmpty(item.ImageUrl))
                {
                    var oldImagePath = Path.Combine(_env.WebRootPath, item.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                // Save the new image
                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                // Update image URL
                item.ImageUrl = $"/uploads/{uniqueFileName}";
            }

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

        // Create a new item with file upload
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem([FromForm] CreateItemDto itemDto, [FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("Image is required.");
            }

            // Save the image to the server
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            // Create the appropriate Item object
            Item item;
            if (itemDto.ItemType == "Bracelet")
            {
                item = new Bracelet
                {
                    ItemName = itemDto.ItemName,
                    ItemDescription = itemDto.ItemDescription,
                    ItemPrice = itemDto.ItemPrice,
                    ItemType = itemDto.ItemType,
                    ImageUrl = $"/uploads/{uniqueFileName}",
                    BraceletSpecificAttribute = itemDto.BraceletSpecificAttribute
                };
            }
            else if (itemDto.ItemType == "Keychain")
            {
                item = new Keychain
                {
                    ItemName = itemDto.ItemName,
                    ItemDescription = itemDto.ItemDescription,
                    ItemPrice = itemDto.ItemPrice,
                    ItemType = itemDto.ItemType,
                    ImageUrl = $"/uploads/{uniqueFileName}",
                    KeychainSpecificAttribute = itemDto.KeychainSpecificAttribute
                };
            }
            else
            {
                item = new Item
                {
                    ItemName = itemDto.ItemName,
                    ItemDescription = itemDto.ItemDescription,
                    ItemPrice = itemDto.ItemPrice,
                    ItemType = itemDto.ItemType,
                    ImageUrl = $"/uploads/{uniqueFileName}"
                };
            }

            // Save the item to the database
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
