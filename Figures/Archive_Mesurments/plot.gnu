set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 24

set out "archiveMesurments.eps"

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
set key inside bottom right
set xlabel 'Year' font ",24"
set ylabel "Growth factor of new websites \n deploying SWs" offset .5,0
set notitle
set format y "%.1fx"
set ytics offset 0.5,0
set boxwidth 0.5
set style fill solid
set pointintervalbox 3
set nokey
set yrange [0:*]
plot "data.csv" using 4:xtic(1) with boxes lc 'red'