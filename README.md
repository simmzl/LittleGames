
# 做些有趣的小游戏以提升自己的技术栈


## 一、动物的战争

> 遇到的问题总结

### 1.HTML 5 新加入的全局属性 hidden
通过css属性选择器设置：

      [hidden]{
            display:none;
      }
设置：hidden ="hidden"
可通过js设置true or false改变；

### 2.HTML 5 新加入的全局自定义属性 data-*
如在本项目中为方格设置data-index="0";
在js中获取：

    function (e) {
        e.target.dataset.index;
    }

### 3.find() & filter()
    arr.find(function(currentValue,index,arr), thisValue)
不会改变原数组的值，
作用为找到则返回第一个找到元素，否则返回undefined;!undefined = true;

js版本：ES6

    array.filter(function(currentValue,index,arr), thisValue)
不会改变原数组的值，
作用为找到并返回所有元素，否则返回undefined;

js版本：1.6


### 4.this
此处报错无法调用this.clickSquare,这个this指向Game,但在function中无法指向Game

    $squares.forEach(function (t) {
        t.addEventListener('click', this.clickSquare.bind(this)) 
    });
解决方法：在该function之外将 this.clickSquare.bind(this)定义为一个变量，再引用：

    //解决forEach内无法用this
    var onClickSquare = this.clickSquare.bind(this);
    //遍历加入事件
    $squares.forEach(function (t) {
        t.addEventListener('click', onClickSquare)
    });
或者定义this为一个变量，也是一个很好用的小技巧

    var self = this;
### 5.element.querySelector(CSS 选择器) & element.querySelectorAll(CSS 选择器);
    element.querySelector(CSS 选择器)
匹配返回指定CSS选择器的第一个元素。如果没有找到，返回 null;

    element.querySelectorAll(CSS 选择器)
    var all = element.querySelectorAll(CSS 选择器);
返回与指定的选择器组匹配的文档中的元素列表 **返回的对象是NodeList，是对象object，也是类数组。**

**那么什么是类数组？**
    即有数组的一些基本属性length、下标索引，其子元素可通过all.item(i)访问；但不完全是数组，如NodeList是DOM操作如getElementsByTagName()等取出来的为类数组；
    
    他们也有自己的属性，例如item，另外NodeList最大的特点就是时效性（live）。与数组的区别以及时效性可以看下[详解](http://blog.csdn.net/u013853928/article/details/52856596)；
    NodeList具有length，下标索引这些数组的属性特征，但是不可以使用数组的push、pop、shift、unshift等数组原生的方法，这时候需要将其转化为数组；
在该项目中，

    var $squares = [].slice.call(document.querySelectorAll('.square'));
其中slice:arrayObj.slice(start, end),作用为截取数组arr中start---end部分返回新的数组，不写Start,end则默认全部；

其中 call([thisObj[,arg1[arg2[[argN]]]]]);

定义：调用一个对象的一个方法，以另一个对象替换当前对象。

说明：call 方法可以用来代替另一个对象调用一个方法。call 方法可将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。
很难懂......找到一个实例：

    function add(a,b)  {alert(a+b);}
    function sub(a,b)  {alert(a-b);}
    add.call(sub,3,1);
    这个例子意思就是用add来替换sub，add.call(sub,3,1) == add(3,1)，//注意：js中的函数其实是对象，函数名是对 Function 对象的引用。
    
所以[].slice.call(document.querySelectorAll('.square'))的意思是：

**用call()将document.querySelectorAll('.square')这个对象（类数组）的值，从而能够通过数组方法slice()截取出来，存入$squares中**；

（理解了半天才懂），也可以通过var $squares = Array.prototype.slice.call(all)实现；

两篇不错的相关博客：
[详解](http://www.cnblogs.com/dingxiaoyue/p/4948166.html)
[实例](http://uule.iteye.com/blog/1158829)
