set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 26

set grid y lt 0 lw 1 lc rgb "#B8B8B8"

set size 1,1.1
set format y "%.0f%%"
set ytics offset 0.5,0
set ylabel offset 0.7,0
set yrange [0:100]
set xrange [-0.5:9.5]
set log y
set nokey
set ylabel "Percentage of sites" offset 1.2,0
set xlabel "Push Ad Networks" offset 0,4
set format y "%.0f%%"
set out "topAdvertisers.eps"
set xtics out right rotate by 90 offset 0,0.4

set boxwidth 0.5
set style fill solid
plot "data.txt" using 2:xtic(1) with boxes lt rgb 'red', \
"" using ($0 + 0.1):($2*1.7):(sprintf("%3.1f%",($2))) with labels font ",20" notitle