﻿namespace BraceletEmpire.Server.Models
{
    public class SmtpSettings
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
        public string FromEmail { get; set; }
        public string Password { get; set; }
        public string BusinessEmail { get; set; }
    }
}