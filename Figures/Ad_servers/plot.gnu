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
set log
a=0
cumulative_sum_a(x)=(a=a+x,a)
plot "data.tsv" using ($1):(cumulative_sum_a($3)) with lines lw 2 lt rgb "red" title "SWs not connecting with any server"

set format "10^{%L}"
set yrange [1:1400]
set xlabel 'Rank of Push Ad Networks'
set ylabel "Number of Sites" offset .5,0
set out "advertisers.eps"

f(x) = a*(x**b)
z(x) = c*(x**d)
fit[4:70] f(x) 'fitData.csv' using 0:2 via a, b
fit[71:*] z(x) 'fitData.csv' using 0:2 via c, d

FIT_TITLE = sprintf("%.2f", b)
SECOND_FIT_TITLE = sprintf("%.2f", d)

# Text
set label 1 FIT_TITLE at 25,85 rotate by -25 textcolor rgb "green70" 
set label 2 SECOND_FIT_TITLE at 150,7 rotate by -45 textcolor rgb "purple"


plot "classiedAdServersByPopularity.txt" using 0:2 lt rgb "red" lw 3 pt 2, \
(x > 4 &&  x < 70 ? f(x) : 1/0 ) lt rgb "green70" lw 3, \
(x > 70 ? z(x) : 1/0 ) lt rgb "purple" lw 3

