cat adThirdPartyServerDatafile.dat | awk -F " " '{print $2-$2%10000}' | uniq -c | awk -F " " '{print $2" "$1}' > adThirdPartyServerDatafile.tsv
cat firstPartyOnlyDatafile.dat | awk -F " " '{print $2-$2%10000}' | uniq -c | awk -F " " '{print $2" "$1}' > firstPartyOnlyDatafile.tsv
cat noServerAtAllDatafile.dat | awk -F " " '{print $2-$2%10000}' | uniq -c | awk -F " " '{print $2" "$1}' > noServerAtAllDatafile.tsv
cat thirdPartyServerDatafile.dat | awk -F " " '{print $2-$2%10000}' | uniq -c | awk -F " " '{print $2" "$1}' > thirdPartyServerDatafile.tsv
