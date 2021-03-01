set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   solid dashlength 2.0 linewidth 3.0 butt \
   palfuncparam 2000,0.003 \
   "Helvetica" 22

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
unset xrange
set size 1,1.1
set format y "%.0f%%"
set yrange [0:20]
set xrange [0.5:10.5]
set ytics offset 0.5,0
set ylabel offset 0.5,0

set key top right samplen 1
#set key left top reverse Left
set style data histogram
set style histogram cluster gap 1
set style fill solid border -1
set ylabel "Percentage of sites" offset .3,0
set xtics rotate by -25 out  offset 0,.5 font  ",20"
set xlabel "Top Content Categories" offset 0,3
set out "similarweb.eps"
plot 'data.csv' u 3:xtic(1) t "sites with SW" lc rgb "blue", \
'' u 5:xtic(1) t "sites with SW fetching ads" lc rgb "red"