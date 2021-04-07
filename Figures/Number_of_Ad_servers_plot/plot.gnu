set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 25

set key inside bottom right
set xlabel 'Total Servers Each Service Worker'
set ylabel 'CDF of Service Workers'
set title 'Number of Ad Servers Visited by a Service Worker'
set yrange [0.1:1]
#plot  "data.txt" using 1:2 title 'Service Workers' with lines
set out "NumOfAdServers.eps"
totalSites = 7444

a=0
cumulative_sum(x)=(a=a+x,a)
plot "data.txt" using 1:(cumulative_sum($2) / totalSites) with lines lw 2 lt rgb "black" notitle