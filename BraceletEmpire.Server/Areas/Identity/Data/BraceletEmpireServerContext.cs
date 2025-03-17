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
                .IsRequired(false);

            // Seed data
            modelBuilder.Entity<Bracelet>().HasData(
                new Bracelet
                {
                    ItemId = 1,
                    ItemName = "Colorful Beaded Bracelet",
                    ItemDescription = "Handmade bracelet with colorful beads, perfect for summer!",
                    ItemPrice = 12.99M,
                    ImageUrl = "https://placehold.co/600x400/pink/white?text=Beaded+Bracelet",
                    BraceletSpecificAttribute = "Glass beads",
                    ItemType = "Bracelet",
                    Quantity = 10
                },
                new Bracelet
                {
                    ItemId = 2,
                    ItemName = "Friendship Bracelet",
                    ItemDescription = "Handwoven friendship bracelet made with embroidery thread",
                    ItemPrice = 8.99M,
                    ImageUrl = "https://placehold.co/600x400/purple/white?text=Friendship+Bracelet",
                    BraceletSpecificAttribute = "Cotton thread",
                    ItemType = "Bracelet",
                    Quantity = 15
                }
            );

            modelBuilder.Entity<Keychain>().HasData(
                new Keychain
                {
                    ItemId = 3,
                    ItemName = "Custom Name Keychain",
                    ItemDescription = "Personalized keychain with your name in colorful beads",
                    ItemPrice = 9.99M,
                    ImageUrl = "https://placehold.co/600x400/purple/white?text=Name+Keychain",
                    KeychainSpecificAttribute = "Acrylic beads",
                    ItemType = "Keychain",
                    Quantity = 8
                },
                new Keychain
                {
                    ItemId = 4,
                    ItemName = "Resin Flower Keychain",
                    ItemDescription = "Beautiful keychain with real flowers preserved in resin",
                    ItemPrice = 14.99M,
                    ImageUrl = "https://placehold.co/600x400/blue/white?text=Resin+Flower",
                    KeychainSpecificAttribute = "Epoxy resin",
                    ItemType = "Keychain",
                    Quantity = 5
                }
            );


            base.OnModelCreating(modelBuilder);
        }
    }
}