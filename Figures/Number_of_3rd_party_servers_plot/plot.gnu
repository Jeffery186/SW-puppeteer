set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 22

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
set key inside bottom right
set xlabel 'Unique third party domains'
set ylabel 'CDF of Service Workers' offset 1.2,0
#set title 'Number of 3rd Party domains Visited by a SW'
set yrange [0:1]
#set xrange [0:20]
set out "NumOf3rdPartyServers.eps"

totalSites = 7444

a=0
cumulative_sum(x)=(a=a+x,a)
b=0
cumulative_sum2(x)=(b=b+x,b)
plot "data.txt" using 1:(cumulative_sum($2)/totalSites) with lines lw 3 lt rgb "blue" t "Total", \
  "../Number_of_Ad_servers_plot/data.txt" using 1:(cumulative_sum2($2)/totalSites) with lines lw 3 lt rgb "red" t "Ad related"

set format y "%.0f%%"
set nokey
set ytics offset 0.5,0
set yrange [*:*]
set ylabel "Percentage of registered SWs" offset 0.5,0
set out "NumOf3rdPartyServers_bars.eps"
set boxwidth 0.5
set style fill solid
plot "data.txt" using 3:xtic(1) with boxes lc 'blue', \
"" using ($0 + 0.05):($3+4):(sprintf("%3.2f%",($3))) with labels font ",12" rotate by 90 notitle