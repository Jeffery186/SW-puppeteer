import sys

with open(sys.argv[1], 'r') as fp:
    firstFile = fp.read().splitlines()

with open(sys.argv[2], 'r') as fp:
    secondFile = fp.read().splitlines()

loopArray = firstFile.copy()

for i in loopArray:
    if i in secondFile:
        firstFile.remove(i)
        secondFile.remove(i)

print("New in files!\n")
print("First file: ", firstFile)
print("\n")
print("Second file: ", secondFile)
print("\n")

