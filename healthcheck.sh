case $(cat health.txt) in
healthy) exit 0;;
unhealthy) exit 1;;
reserved) exit 2;;
*) exit 100;
esac

