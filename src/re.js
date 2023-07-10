class RouteExplorer {
  version = "0.1";
  trace = null;
  locations = {};

  constructor(data, locations) {
    this.trace = new Trace(data);
    this.locations = locations;
  }

  asnColors() {
    const colors = [
      "#3366cc",
      "#dc3912",
      "#ff9900",
      "#109618",
      "#990099",
      "#0099c6",
      "#dd4477",
      "#66aa00",
      "#b82e2e",
      "#316395",
      "#994499",
      "#22aa99",
      "#aaaa11",
      "#6633cc",
      "#e67300",
      "#8b0707",
      "#651067",
      "#329262",
      "#5574a6",
      "#3b3eac",
    ];

    const asnColors = { "": "#333333" };

    let i = 0;
    for (const ip in this.trace.asns) {
      const asn = this.trace.asns[ip];
      if (!(asn in asnColors)) {
        asnColors[asn] = colors[i % colors.length];
        i++;
      }
    }

    return asnColors;
  }

  graph() {
    const nodes = {};
    let edges = [];

    const asnColors = this.asnColors();
    const ip2asn = this.trace.ip2asn();
    const traceGraph = this.trace.graph();

    for (const src in traceGraph) {
      if (!(src in nodes)) {
        const srcAsn = ip2asn[src];
        const location = this.locations[src];
        const bgColor = asnColors[srcAsn];

        nodes[src] = {
          data: {
            id: src,
            bg: bgColor,
            location,
            borderColor: ip2asn[src] === "" ? bgColor : "red",
          },
        };
      }

      for (const dst of traceGraph[src]) {
        if (!(dst in nodes)) {
          const dstAsn = ip2asn[dst];
          const location = this.locations[dst];
          const bgColor = asnColors[dstAsn];

          nodes[dst] = {
            data: {
              id: dst,
              bg: bgColor,
              location,
              borderColor: ip2asn[dst] === "" ? bgColor : "red",
            },
          };
        }
        edges.push({ data: { source: src, target: dst } });
      }
    }

    return {
      nodes: Object.values(nodes),
      edges: edges,
    };
  }

  renderPath() {
    const graph = this.graph();

    var cy = cytoscape({
      container: document.getElementById("route"),
      boxSelectionEnabled: false,
      autounselectify: true,
      maxZoom: 2,
      layout: {
        name: "dagre",
        nodeDimensionsIncludeLabels: true,
      },
      elements: {
        nodes: graph["nodes"],
        edges: graph["edges"],
      },
      style: [
        {
          selector: "node",
          style: {
            content: "data(id)",
            "text-valign": "bottom",
            "text-halign": "center",
            "background-color": "data(bg)",
            "border-width": "3px",
            "border-color": "data(borderColor)",
          },
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            width: "4",
            "target-arrow-shape": "triangle",
            "line-color": "#9dbaea",
            "target-arrow-color": "#9dbaea",
          },
        },
      ],
    });

    cy.on("click", "node", function (event) {
      const node = event.target;
      const description = node.data("location");

      console.log(description?.geo);

      if (!description?.geo) {
        return;
      }

      const modalDescription = document.getElementById("modal-description");
      modalDescription.innerHTML = "";

      const titleElement = document.createElement("h2");
      titleElement.textContent = description.geo.ip;

      modalDescription.appendChild(titleElement);

      delete description.geo.ip;

      for (const key in description.geo) {
        if (description.geo.hasOwnProperty(key)) {
          const keyValueElement = document.createElement("p");
          const keyElement = document.createElement("strong");

          keyElement.textContent = key.toUpperCase();
          keyValueElement.appendChild(keyElement);
          keyValueElement.innerHTML += ": " + (description.geo[key] || "");

          modalDescription.appendChild(keyValueElement);
        }
      }

      document.getElementById("modal").style.display = "block";
    });

    document.getElementsByClassName("close")[0].onclick = function () {
      document.getElementById("modal").style.display = "none";
    };
  }

  renderTitle() {
    const title = "MCA to " + this.trace.header["dst_ip"];
    $("#re #hud").append($("<h1>").html(title));
  }

  renderMetadata(data) {
    const box = $("<div>").addClass("hud-box");
    for (const d of data) {
      const line = $("<div>").html(d.title + ": " + d.value);
      box.append(line);
    }
    $("#re #hud").append(box);
  }

  renderConfig() {
    const config = [
      {
        title: "Alpha",
        value: this.trace.header["alpha"],
      },
      {
        title: "Protocol",
        value: this.trace.header["probe_type"].toUpperCase(),
      },
      {
        title: "Fields",
        value: this.trace.header["fid_fields"].join(", "),
      },
    ];

    this.renderMetadata(config);
  }

  renderTime() {
    const time = [
      {
        title: "Total time",
        value: this.trace.totalTime.toFixed(2),
      },
      {
        title: "Init time",
        value: Util.ts2human(this.trace.stats["init_time"]),
      },
      {
        title: "End time",
        value: Util.ts2human(this.trace.stats["finish_time"]),
      },
    ];

    this.renderMetadata(time);
  }

  renderPackets() {
    const packets = [
      {
        title: "Sent packets",
        value: this.trace.stats["sent_packets"],
      },
      {
        title: "Matched packets",
        value: this.trace.stats["matched_packets"],
      },
      {
        title: "Matches on retry",
        value: this.trace.stats["matches_on_retry"],
      },
      {
        title: "Total retries",
        value: this.trace.stats["retries"],
      },
      {
        title: "PPS",
        value:
          this.trace.totalTime.toFixed(2) +
          " (" +
          this.trace.header["pps"] +
          ")",
      },
    ];

    this.renderMetadata(packets);
  }

  renderVersion() {
    const v = $("<span>").html("Route Explorer " + this.version);
    $("#re #version").append(v);
  }

  render() {
    this.renderTitle();
    this.renderConfig();
    this.renderTime();
    this.renderPackets();
    this.renderVersion();
    this.renderPath();
  }
}
