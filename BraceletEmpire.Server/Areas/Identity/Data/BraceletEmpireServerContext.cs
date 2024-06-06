using BraceletEmpire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BraceletEmpire.Server.Data
{
    public class BraceletEmpireServerContext : DbContext
    {
        public BraceletEmpireServerContext(DbContextOptions<BraceletEmpireServerContext> options)
            : base(options)
        {
        }

        public DbSet<Item> Items { get; set; } = default!;
        public DbSet<Order> Orders { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Item>()
                .HasDiscriminator<string>("ItemType")
                .HasValue<Item>("Item")
                .HasValue<Bracelet>("Bracelet")
                .HasValue<Keychain>("Keychain");

            // Configure the decimal precision and scale for ItemPrice
            modelBuilder.Entity<Item>()
                .Property(i => i.ItemPrice)
                .HasColumnType("decimal(18,2)");

            // Configure the relationship between Order and Item
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .IsRequired(false); // Make the foreign key optional

            base.OnModelCreating(modelBuilder);
        }
    }
}