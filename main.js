$(document).ready(function()
{

        var settings = {
                endpoint: "network.php",
                download: {delay: 7000},
                upload: {delay: 7000}
        };
        var gaugeparam = {
                id: "gauge",
                value: 0,
                min: 0,
                max: 100,
                title: "Speed",
                label: "Mbps",
                gaugeWidthScale: 0.03,
                decimals: 2,
                counter: true,
                relativeGaugeSize: true
        };

        var gauge = new JustGage(gaugeparam);
        var net = new Network(settings);

        net.latency.on("end",
                function(avgrtt, allrtt) {
                        $("#rtt").html(avgrtt.toFixed(2) + " ms");
                        net.download.start();
                }
        );

        net.download
                .on("progress", function(avg) {
                        avg = avg * 8 / 1024 / 1024;
//                        $("#down").html(avg.toFixed(2) + " Mbps");
                        gauge.txtTitle.attr({
                                "text": "DOWNLOAD"
                        });
                        gauge.refresh(avg.toFixed(2));
                })
                .on("end", function(avg) {
                        avg = avg * 8 / 1024 / 1024;
                        $("#down").html(avg.toFixed(2) + " Mbps");
                        gauge.refresh(0);
                        setTimeout(function() {net.upload.start();}, 3000);
                });

        net.upload
                .on("progress", function(avg) {
                        avg = avg * 8 / 1024 / 1024;
//                        $("#up").html(avg.toFixed(2) + " Mbps");
                        gauge.txtTitle.attr({
                                "text": "UPLOAD"
                        });
                        gauge.refresh(avg.toFixed(2));
                })
                .on("end", function(avg) {
                        avg = avg * 8 / 1024 / 1024;
                        $("#up").html(avg.toFixed(2) + " Mbps");
                        gauge.refresh(0);
                        gauge.txtTitle.attr({
                                "text": "TEST FINISHED"
                        });
                });

        $(document).on("click", "#start", function() {
                $.ajax({
                        url: "net.php",
                        type: "POST",
                        dataType: "json",
                        success: function(retval) {
                               $("#ip").html(retval.ip); 
                               $("#isp").html(retval.isp); 
                        },
			complete: function() {
				net.latency.start();
			}
                });
        });

});
