# kmap-solver

`kmap-solver` is a command line tool to solve and visualize `Karnaugh Maps` up to 4 variables.

![](https://raw.githubusercontent.com/obsfx/kmap-solver/main/media/a.png)



## installation

```
npm i -g kmap-solver
```



## usage

![](https://raw.githubusercontent.com/obsfx/kmap-solver/main/media/b.gif)

```
Usage: kmap-solver [options]

Options:
  -v, --variables <values>  variables that will be used (maximum 4 vars) e.g. -v w,x,y,z
  -m, --minterms <values>   decimal minterm positions e.g. -m 0,1,4,5,12
  -d, --dontcares <values>  (optional) dont care positions e.g. -d 0,2,3,6
  -h, --help                display help for command

```