set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   solid dashlength 2.0 linewidth 3.0 butt \
   palfuncparam 2000,0.003 \
   "Helvetica" 25

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
unset xrange
set format y "%.0f%%"
#set size 1.2,1.2
#set yrange [0:30]
set ytics font  ",25" offset 0.5,0
set ylabel offset 0.5,0

unset key
#set key left top reverse Left
#set xrange [0.5:6.7]
set style data histogram
set style histogram cluster gap 1
set style fill solid border -1
set ylabel "Percentage of sites" offset .3,0
set xtics rotate by -35 out  offset 0,.5 font  ",25"
set xlabel "Top 10 Ad Servers" offset 0,1.5
set out "topAdvertisers.eps"
plot 'data.csv' u 3:xtic(1) t col(1) lc rgb "black"