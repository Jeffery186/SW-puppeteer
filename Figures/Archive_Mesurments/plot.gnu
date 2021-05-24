set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 22

set out "archiveMesurments.eps"

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
set key inside bottom right
set xlabel 'Year' font ",24"
set ylabel 'Number of Service Workers' offset 1.2,0 font ",24"
set notitle
set ytics offset 0.5,0
set boxwidth 0.5
set style fill solid
set pointintervalbox 3
set xtics font ",20" rotate by -45 left
set nokey

plot "data.dat" using 2:xtic(1) with boxes lc 'red',\
"" using ($0):($2 + 100):(sprintf("%d",($2))) with labels font ",18" notitle