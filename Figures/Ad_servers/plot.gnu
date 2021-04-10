set terminal postscript enhanced eps color defaultplex \
   leveldefault  colortext \
   linewidth 3.0 butt solid \
   palfuncparam 2000,0.003 \
   "Helvetica" 27

set grid y lt 0 lw 1 lc rgb "#B8B8B8"
set key inside bottom right samplen 2
set xlabel "Number of Sites"
set ylabel 'CDF of Push Advertisers' offset 2,0
#plot  "data.txt" using 1:2 title 'Service Workers' with lines
set out "advertisers_market_share_cdf.eps"
set yrange [0:1]
set xrange [1:1000]
set nokey

set ytics offset 0.5,0

#plot "adThirdPartyServerDatafile.tsv" using 1:3 with lines lw 2 
set log x 
a=0
cumulative_sum_a(x)=(a=a+x,a)
plot "data.tsv" using ($1):(cumulative_sum_a($3)) with lines lw 2 lt rgb "red" title "SWs not connecting with any server"

unset yrange
set xlabel 'Number of Push Aadvertisers'
set ylabel "Number of sites"
set out "advertisers.eps"
plot "classiedAdServersByPopularity.txt" using 2 lt rgb "red" 