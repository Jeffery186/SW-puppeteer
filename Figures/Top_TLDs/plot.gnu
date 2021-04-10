set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 25

set grid y lt 0 lw 1 lc rgb "#B8B8B8"

set format y "%.0f%%"
set ytics offset 0.5,0
set ylabel offset 0.5,0
set yrange [0:250]
set xrange [0.5:10.5]
set xlabel "TLDs"
set log y
set nokey
set ylabel "Percentage of sites" offset .5,0
set out "tlds.eps"

set boxwidth 0.5
set style fill solid
plot "data.txt" using 3:xtic(1) with boxes lt rgb 'red', \
"" using ($0 + 0.05):($3*2):(sprintf("%3.2f%",($3))) with labels font ",15" notitle