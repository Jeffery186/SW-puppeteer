# Scale font and line width (dpi) by changing the size! It will always display stretched.
set terminal svg size 400,300 enhanced fname 'arial'  fsize 10 butt solid
set output 'out.svg'

# Key means label...
set key inside bottom right
set xlabel 'Total Servers Each Service Worker'
set ylabel 'CDF of Service Workers'
set title 'Number of 3rd Party Servers Visited by a Service Worker'
set yrange [0.1:1]

totalSites = 7444

a=0
cumulative_sum(x)=(a=a+x,a)
plot "data.txt" using 1:(cumulative_sum($2)/totalSites) with lines lw 2 lt rgb "black" notitle