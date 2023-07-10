# MCA

[![PyPI Version](https://img.shields.io/pypi/v/mca-traceroute.svg)](https://pypi.python.org/pypi/mca-traceroute/)  <!-- ignore_ppi -->
[![Python Versions](https://img.shields.io/pypi/pyversions/mca-traceroute.svg)](https://pypi.python.org/pypi/mca-traceroute/)  <!-- ignore_ppi -->
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)  <!-- ignore_ppi -->

This tool implements the Multipath Classification Algorithm (MCA), an extension to Paris traceroute and the Multipath Detection Algorithm (MDA). MCA can detect routers that perform load balancing and identify what fields in the IP and transport headers are used for load balancing.

A more detailed explanation of MCA, together with a characterization of load balancing appeared in our INFOCOM 2020 paper:

R. Almeida, Í. Cunha, R. Teixeira, D. Veitch, and C. Diot. "Classification of Load Balancing in the Internet". In Proc. IEEE INFOCOM, 2020. [PDF][1] [BibTeX][2]

## Installation

MCA has been tested on Linux. It requires Python 3.6+ and Scapy 2.4+. The latest version is available on [PyPI](https://pypi.python.org/pypi/mca-traceroute), the Python Package Index:

``` {sh}
pip3 install mca-traceroute
mca-traceroute --help
```

You can also run MCA as a Python module directly from the Git repository. You may need to install Scapy as `root` as MCA requires root privileges to execute.

``` {sh}
sudo pip3 install scapy
git clone https://github.com/rlcalmeida/mca.git
cd mca
sudo python3 -m mca --help
```

## Additional Resources

[Route Explorer](https://github.com/rlcalmeida/route-explorer) is a visualization framework for MCA results.  It renders MCA measurements in a Web browser using Javascript libraries and supports IP-to-AS, AS-to-name, and rDNS metadata.  Our paper's dataset and some example load balancers configuration are [publicly available](https://homepages.dcc.ufmg.br/~rlca/mca).

[1]: http://homepages.dcc.ufmg.br/~cunha/papers/almeida20infocom-mca.pdf
[2]: https://homepages.dcc.ufmg.br/~cunha/papers/almeida20infocom-mca.txt

# Route Explorer

A tool for visualizing Internet route measurements ([demo](https://homepages.dcc.ufmg.br/~rlca/mca/route-explorer?m=syd-au-ark.1538842645.ipv4.61-113-124-224.tcp.daddr-tos-dport.json))

## Dependencies

* cytoscape.js 3.8.0
* cytoscape-dagre 2.2.1
* dagre 0.7.3
* jquery 3.4.1
* normalize.css 8.0.1

## Running locally

1. Clone this repository and `cd` into it  
1. Start a simple http server using `python3 -m http.server`  
1. Navigate to the address pointed by Python  
