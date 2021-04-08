set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 21


set grid y lt 0 lw 1 lc rgb "#B8B8B8"
set format y "%.0f%%"
set nokey
set xlabel 'Unique push ad domains'
set ylabel 'Percentage of registered SWs' offset 0.5,0
#set title 'Number of Ad Servers Visited by a Service Worker'
set yrange [0:100]
set ytics offset 0.5,0
#plot  "data.txt" using 1:2 title 'Service Workers' with lines
set out "NumOfAdServers.eps"
#set log y

set boxwidth 0.5
set style fill solid
plot "data.txt" using 3:xtic(1) with boxes lc 'red', \
"" using ($0 + 0.1):($3+10):(sprintf("%3.2f%",($3))) with labels font ",15" rotate by 90 