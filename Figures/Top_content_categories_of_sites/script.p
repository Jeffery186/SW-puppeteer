set terminal postscript enhanced eps color defaultplex \
   leveldefault  blacktext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 22

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
unset xrange
set size 1,1
set format y "%.0f%%"
set yrange [0:30]
set xrange [-0.5:14.5]
set ytics offset 0.5,0
set ylabel offset 0.5,0

set key top right samplen 1 font ",20"
set style data histogram
set style histogram cluster gap 1
set style fill solid border -1
set ylabel "Percentage of sites" offset .3,0
set xtics rotate by -35 out  offset 0,.5 font  ",20"
set xlabel "Top Content Categories" offset 0,4
set out "similarweb.eps"
totalSites = 6425


plot "data.dat" using (($2 / totalSites) * 100):xtic(1) title "sites with SW" fs solid lc rgb "blue",\
     "" using ($0 - 0.1):((($2 / totalSites) * 100) + 0.5):(sprintf("%3.2f%",($2/totalSites)*100)) with labels font ",13" rotate by 65 offset 0.6,1 notitle,\
     "" using (($4 / totalSites) * 100) title "sites with SW fetching ads" fs solid lc rgb "red",\
     "" using ($0 + 0.2):((($4 / totalSites) * 100) + 0.5):(sprintf("%3.2f%",($4/totalSites)*100)) with labels font ",13" rotate by 65 offset 0.6,1 notitle