set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 25

set key inside bottom right
set xlabel 'Total Servers Each Service Worker'
set ylabel 'CDF of Service Workers'
set title 'Number of Ad Servers Visited by a Service Worker'
set yrange [0.1:1.1]
#plot  "data.txt" using 1:2 title 'Service Workers' with lines
set out "NumOfAdServers.eps"
set key font ",15"

totalSites = 7444

a=0
cumulative_sum_a(x)=(a=a+x,a)
b=0
cumulative_sum_b(x)=(b=b+x,b)
c=0
cumulative_sum_c(x)=(c=c+x,c)

plot "data.txt" using 1:(cumulative_sum_a($2) / totalSites) with lines lw 2 lt rgb "blue" title "Requests to 1st and 3rd party servers",\
         "" using 1:(cumulative_sum_b($3) / totalSites) with lines lw 2 lt rgb "red" title "Requests to 3rd party servers",\
         "" using 1:(cumulative_sum_c($4) / totalSites) with lines lw 2 lt rgb "green" title "Requests to ad 3rd party servers"