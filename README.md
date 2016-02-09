ITS-assistant
=============


A Symfony project created on November 18, 2015, 11:55 pm.

This project created for help students NTUU KPI Institute of Telecommunication Systems.

The project consists of four parts: IP-calculator, Report Wizard, Karnaugh map, chart volpera Smith.

1)  Ip-calc takes an IP address and netmask and calculates the resulting broadcast, network, Cisco wildcard mask, and host range. By giving a second netmask, you can design subnets and supernets. It is also intended to be a teaching tool and presents the subnetting results as easy-to-understand binary values.

Enter your netmask(s) in CIDR notation (/25) or dotted decimals (255.255.255.0). Inverse netmasks are recognized. If you omit the netmask ipcalc uses the default netmask for the class of your network.

Look at the space between the bits of the addresses: The bits before it are the network part of the address, the bits after it are the host part. You can see two simple facts: In a network address all host bits are zero, in a broadcast address they are all set.

2)  Report Wizard generates the title page of your report, based on data that you enter.

In projest used : Framework PHP Symfony 2, Bootstrap 3 Framework, Jquery(small), Native JS(many), Knp-Snappy-Bundle (for generate pdf files)

Project Team : Aleksandr Khylobokyi(team lider), Irina Timchenko(junior dev), Gavrilin Ivan(web-design)
