# Scale font and line width (dpi) by changing the size! It will always display stretched.
set terminal svg size 400,300 enhanced fname 'arial'  fsize 10 butt solid
set output 'out.svg'

# Key means label...
set key inside bottom right
set xlabel 'Total Servers Each Service Worker'
set ylabel 'CDF of Service Workers'
set title 'Number of Ad Servers Visited by a Service Worker'
set yrange [3000:8000]
#plot  "data.txt" using 1:2 title 'Service Workers' with lines

a=0
cumulative_sum(x)=(a=a+x,a)
plot "data.txt" using 1:(cumulative_sum($2)) with lines lw 2 lt rgb "black" notitle