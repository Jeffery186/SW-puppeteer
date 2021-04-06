# Scale font and line width (dpi) by changing the size! It will always display stretched.
set terminal svg size 400,300 enhanced fname 'arial'  fsize 10 butt solid
set output 'out.svg'

# Key means label...
set boxwidth 0.5
set style fill solid
set xtics rotate by -45
set yrange [:50]
set boxwidth 0.5 relative
set ylabel "Percentage of registered SWs"
set xlabel "System"
set format y "%.0f%%"
set xlabel font ",12"
set ylabel font ",8"

plot "data.txt" using 2:xtic(1) with boxes t "" lc rgb "black",\
		"" using ($0 + 0.05):($2 + 1.1):(sprintf("%3.2f%",($2))) with labels font ",5" notitle