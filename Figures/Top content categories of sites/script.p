set terminal svg size 1000,600 enhanced fname 'arial'
set output 'out.svg'

set yrange [0:25]

totalSites = 6425

set xtics rotate by -45 font ", 10" 
set title ''

set ytics format "{/:Bold {/=14 %h}}"

set format y "%.0f%%"
set ylabel "Percentage of sites"
set xlabel "Top Content Categories"

set boxwidth 0.8
set style data histograms
set style histogram cluster gap 2

plot "data.dat" using (($2 / totalSites) * 100):xtic(1) title "sites with SW" fs solid lc rgb "blue",\
     "" using ($0 - 0.1):((($2 / totalSites) * 100) + 0.3):(sprintf("%3.2f%",($2/6425)*100)) with labels font ",6" notitle,\
     "" using (($4 / totalSites) * 100) title "sites with SW fetching ads" fs solid lc rgb "red",\
     "" using ($0 + 0.2):((($4 / totalSites) * 100) + 0.3):(sprintf("%3.2f%",($4/6425)*100)) with labels font ",6" notitle