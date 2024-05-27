using BraceletEmpire.Server.Areas.Identity.Data;
using BraceletEmpire.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BraceletEmpire.Server.Data;

public class BraceletEmpireServerContext : DbContext
{
    public BraceletEmpireServerContext(DbContextOptions<BraceletEmpireServerContext> options)
        : base(options)
    {
    }

    public DbSet<Item> Items { get; set; } = default!;

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

        base.OnModelCreating(modelBuilder);
    }
}
