
;(function (window, undefined){
	var count = 0,
		// checkbox计数器
		inputCount = 0,
		// 存储所有的YnTree对象
		ynTrees = {},
		classNameCfg = {
			// 节点展开的classname
			spread: "spread",
			// 节点收缩的classname
			shrink: "shrink"
		}
	/**
	 * 权限树构造函数
	 * @param {dom} ele     权限树容器
	 * @param {object} options 权限树配置
	 */
	function YnTree(ele, options){
		if(!ele || !ele.nodeName || (ele.nodeType != 1)){
			throw "YnTree 第一个参数必须是一个元素！";
		}
		this.ele = ele;
		var type = YnTree.getType(options);
		
		if(type != "object"){
			throw "YnTree 第二个参数必须是一个对象！";
		}
		this.options = options;
		!this.options.data ? this.options.data = [] :"";
		// 如果数据不是一个数组，则将其转换成数组
		if(YnTree.getType(this.options.data) == "object"){ 
			this.options.data = [this.options.data];
		}
		// 存储节点数据
		this.data = [];
		// 存储平行的节点数据，方便后期查找父元素
		this.parallel = [];

		// 存储最外层的树结构
		
		this.id = "yn_tree" + (++count);
		this.tree = YnTree.createDomByString('<ul class="yn-tree" id="' + this.id + '"></ul>');

		this._init();
	}
	YnTree.prototype._init = function (){
		var that = this;		

		// 如果没有数据则不生成dom元素，也不组装
		if(this.options.data.length > 0){
			// 拷贝数据，将用户传递过来的节点数据拷贝到this.data中，以免污染用户传递的原始数据
			this._copyData(this.options.data, this.data);
			
			// 根据数据生成dom元素
			this._createDom(this.data);
			// 组装dom元素
			this._assemblyDom(this.tree, this.data);
		}		

		this.ele.appendChild(this.tree);
		console.log(this);
		ynTrees[this.id] = this;
		return this;
	}
	YnTree.prototype.version = "1.0.0";
	/**
	 * 拷贝数据
	 * @param  {array、object} data 数据
	 * @return {object}      this
	 */
	YnTree.prototype._copyData = function (data, parent){
		var that = this;
		data = data || that.options.data;
		YnTree.getType(data) != "array" ? (data = [data]) : "";

		YnTree.forEach(data, function (index, item){
			if(item.children){
				var obj = new CompositeLeaf(item, "composite", that.id);
				parent.push(obj);
				that.parallel.push(obj);
				that._copyData(item.children, obj.children);
			}else{
				var obj = new CompositeLeaf(item, "leaf", that.id);
				parent.push(obj);
				that.parallel.push(obj);
			}			
		});
		
		return this;
	}
	/**
	 * 创建dom元素
	 * @return {object} object
	 */
	YnTree.prototype._createDom = function (data, parent){
		var that = this;
			///data = this.data;

		YnTree.forEach(data, function (index, item){
			var html = '',
				id = 'yn_tree_input' + (++inputCount),
				nameVal = item.inputName ? item.inputName : "",
				val = item.value ? item.value : "",
				checked = item.checked ? item.checked : false,
				disabled = item.disabled ? item.disabled : false,
				className = item.className ? item.className : "";
			html += '<li class="yn-tree-li shrink" id="' + id + '_li" ' + (parent ? ('pid="' + parent.id + '"') : "") + '>';
			html += '	<div class="checkbox">';

			if(item.children){
				html += '<span class="arrow arrow-right"></span>';
			}

			html += '		<label>';
			html += '			<input type="checkbox" class="yn-tree-input ' + className + '" id="' + id + '" ' + (checked ? 'checked="checked"' : '') + (disabled ? 'disabled="disabled"' : '') + (parent && parent.id ? (' pid="' + parent.id + '"') : "") + ' name="' + nameVal + '" value="' + val + '">' + item.name;
			html += '		</label>';
			html += '	</div>';
			if(item.children){
				html += '<ul class="yn-tree"></ul>';
				item.type = "composite";
			}else{
				item.type = "leaf";
			}
			html += '</li>';

			item.id = id;
			item.pid = (parent ? parent.id : null);
			item.dom = YnTree.createDomByString(html);


			// 给复选框绑定change事件
			bindChangeEvent(item.dom.querySelector(".yn-tree-input"), item);
			if(item.children){
				// 给展开/收缩节点的三角绑定点击事件
				arrowBindClickEvent(item.dom.querySelector(".arrow-right"), item);
			}
			

			if(item.children){
				that._createDom(item.children, item);
			}

		});

		return this;
	}
	/**
	 * 将dom元素组装起来
	 * @return {object} this
	 */
	YnTree.prototype._assemblyDom = function(parent, data){
		var that = this;

		if(!parent && !data){
			return this;
		}
		YnTree.getType(data) != "array" ? (data = [data]) : data;

		YnTree.forEach(data, function (index, item){
			parent.appendChild(item.dom);

			if(item.children){
				that._assemblyDom(item.dom.querySelector(".yn-tree"), item.children);
			}
		});

		return this;
	}
	/**
	 * 根据id、复选框的值或复选框设置复选框选中或不选中
	 * @param  {stirng、dom} condition 需要选中的id、复选框的值或复选框
	 * @param  {boolean} flag      选中或不选中
	 * @return {object}           this
	 */
	YnTree.prototype.select = function (condition, flag){
		var that = this,
			dataItem = null;
		YnTree.forEach(that.parallel, function(index, item){
			var curInput = document.getElementById(item.id);
			if(condition === item.id || condition === item.value || condition === curInput){
				dataItem = item;
				return false;
			}
		});
		dataItem.select(flag);
		return this;
	}
	/**
	 * 根据id、复选框的值或复选框设置复选框可用/不可用
	 * @param  {stirng、dom} condition id、复选框的值或复选框
	 * @param  {boolean} flag      可用/不可用
	 * @return {object}           this
	 */
	YnTree.prototype.disable = function (condition, flag){
		var that = this,
			dataItem = null;
		YnTree.forEach(that.parallel, function(index, item){
			var curInput = document.getElementById(item.id);
			if(condition === item.id || condition === item.value || condition === curInput){
				dataItem = item;
				return false;
			}
		});
		dataItem.disable(flag);
		return this;
	}
	/**
	 * 获取所有选中的复选框
	 * @return {array} 返回所有选中的复选框
	 */
	YnTree.prototype.getCheckedInputs = function (){
		var that = this,
			checkedInput = [];
		YnTree.forEach(that.parallel, function (index, item){
			if(item.checked){
				checkedInput.push(document.getElementById(item.id));
			}
		});
		return checkedInput;
	}
	/**
	 * 获取所有选中的复选框的值
	 * @return {array} 返回所有选中的复选框的值
	 */
	YnTree.prototype.getValues = function (){
		var that = this,
			checkedVals = [];
		YnTree.forEach(that.getCheckedInputs(), function (index, item){
			checkedVals.push(item.value);
		});
		return checkedVals;
	}
	/**
	 * 重新初始化权限树
	 * @return {[type]} [description]
	 */
	YnTree.prototype.reInit = function (data){
		var that = this;		

		if(data && YnTree.getType(data) == "array"){
			this.options.data = data;
		}

		// 如果没有数据则不生成dom元素，也不组装
		if(this.options.data.length > 0){

			// 将原来的树节点移除，然后再重新生成一个
			this.ele.removeChild(this.tree);
			this.tree = YnTree.createDomByString('<ul class="yn-tree" id="' + this.id + '"></ul>');

			this.data = [];

			// 拷贝数据，将用户传递过来的节点数据拷贝到this.data中，以免污染用户传递的原始数据
			this._copyData(this.options.data, this.data);
			
			// 根据数据生成dom元素
			this._createDom(this.data);
			// 组装dom元素
			this._assemblyDom(this.tree, this.data);
			this.ele.appendChild(this.tree);
		}
		
		console.log("重新初始化");
		return this;
	}
	/**
	 * 销毁当前树
	 * @return {undefined} undefined
	 */
	YnTree.prototype.destroy = function (){
		this.ele.removeChild(this.tree);
		this.options = null;
		this.parallel = null;
		this.tree = null;
		this.id = null;
		this.data = null;
		this.ele = null;
		console.info("YnTree销毁完毕，建议您将YnTree的实例置为null，如：\r\n var ynTree = new YnTree(...);\r\n ynTree.destroy();\r\n ynTree = null;");
	}
	/**
	 * 根据id、复选框的值或复选框设置节点展开或收缩
	 * @param  {stirng、dom} condition id、复选框的值或复选框
	 * @param  {boolean} flag      展开或收缩
	 * @return {object}           this
	 */
	YnTree.prototype.spread = function (condition, flag){
		var that = this,
			dataItem = null;
		YnTree.forEach(that.parallel, function(index, item){
			var curInput = document.getElementById(item.id);
			if(condition === item.id || condition === item.value || condition === curInput){
				dataItem = item;
				return false;
			}
		});
		if(dataItem.type == "leaf"){
				return this;
		}
		dataItem.spread(flag);
		return this;
	}

	/**
	 * 根据html字符串创建dom
	 * @param  {string} htmlStr html字符串
	 * @return {dom}         返回生成的dom元素
	 */
	YnTree.createDomByString = function (htmlStr){
		var ele = document.createElement("div"),
			dom;
		ele.innerHTML = htmlStr;
		dom = ele.children;
		ele = null;
		return dom[0];
	}
	/**
	 * 获取数据的数据类型
	 * @param  {anly} data 需要检测的数据
	 * @return {string}      返回获取到的数据类型
	 */
	YnTree.getType = function (data){
		var type = Object.prototype.toString.call(data);
		return type.replace("[","").replace("]","").split(" ")[1].toLowerCase();
	}
	/**
	 * 遍历数组
	 * @param  {Array} arr 需要遍历的数组
	 * @param  {function} fn 遍历时的回调
	 * @return {Array}      返回当前数组
	 */
	YnTree.forEach = function (arr, fn){
		if(YnTree.getType(arr) != "array"){
			return arr;
		}
		for(var i = 0, len = arr.length; i < len; i++){
			var val = fn.call(arr[i], i, arr[i]);
			if(val === false){
				break;
			}
		}
		return arr;
	}
	/**
	 * 给指定元素绑定事件
	 * @param  {dom}   ele  需要绑定事件的元素
	 * @param  {string}   type 事件类型
	 * @param  {Function} fn   点击事件后的回调函数
	 * @return {dom}        返回元素
	 */
	YnTree.on = function (ele, type, fn){
		if(document.addEventListener){
			ele.addEventListener(type, fn, false);
		}else if(window.attachEvent){
			// 防止IE同一个事件绑定多次时执行顺序乱掉
			if(!ele["_" + type +"_event"]){
				var arr = [fn];
				ele["_" + type +"_event"] = arr;
			}else{
				ele["_" + type +"_event"].push(fn);
			}
			ele.attachEvent("on" + type, function (){
				var e = window.event;
				// 统一事件行为
				e.preventDefault = function (){
					e.returnValue = false;
				}
				e.stopPropagation = function (){
					e.calcleBubble = true;
				}
				e.target = e.srcElement;
				fn.call(ele, e);
			});
		}
		return ele;
	}
	/**
	 * 浅层次拷贝对象
	 * @param  {objeect} target 目标对象
	 * @param  {objeect} obj    
	 * @return {object}        目标对象
	 */
	YnTree.extend = function (target, obj){
		for(var attr in obj){
			if(obj.hasOwnProperty(attr)){
				target[attr] = obj[attr];
			}
		}
		return target;
	}


	// 给复选框绑定chage事件
	function bindChangeEvent(input, currentData){
		YnTree.on(input, "change", function (e){
			var curInput = e.target;
			currentData.select(curInput.checked);
		});
	}
	// 给展开/收缩节点的三角绑定点击事件
	function arrowBindClickEvent(arrowEle, currentData){
		YnTree.on(arrowEle, "click", function (e){
			currentData.spread();
		});
	};

	/**
	 * CompositeLeaf对象构造函数
	 * @param {object} options 组合对象参数
	 * @param {string} type 当前对象的类型，composite表示当前对象为组合对象，组合对象可以有子元素。
	 * leaf表示叶子对象，叶子对象没有子元素
	 * @param {object} ynTree 当前YnTree类的实例对象。因为YnTree与CompositeLeaf是两个不同的对象，
	 * 并且它们之间必须有关联(使用这种方式会造成循环引用，目前没有找到更好的方法)
	 */
	function CompositeLeaf(options, type, ynTreeId){
		this.type = type || "";
		YnTree.extend(this, options || {});
		// 将原来的children清空
		if(this.children){
			this.children = [];	
		}
		// 之前是存储的YnTree对象，由于这样存储会造成循环引用，所以后面改为存储YnTree的ID
		//this.ynTree = ynTree;
		this.ynTreeId = ynTreeId;
	}
	CompositeLeaf.prototype = {
		constructor: CompositeLeaf,
		/**
		 * 树节点一直向下选择
		 * @param  {boolean} flag 当前节点下的所有子节点是否全部选中
		 * @return {object}      this
		 */
		selectDown: function(flag){
			var that = this;
			flag = !!flag;
			
			if(that.children){
				YnTree.forEach(that.children, function (index, item){
					if(!item.disabled){
						item.checked = flag;
						item.dom.querySelector(".yn-tree-input").checked = flag;
					}
					
					if(item.children){
						YnTree.forEach(item.children, arguments.callee);
					}
				});
			}
			return this;
		},
		/**
		 * 根据pid一直向上选择树节点
		 * @param  {boolean} flag 父节点是否选中
		 * @return {object}     this
		 */
		selectUp: function(flag){
			var that = this,
				parent = null;
			flag = !!flag;

			if(!this.pid){ return this; }
			YnTree.forEach(that.getYnTree(that.ynTreeId).parallel, function (index, item){
				//console.log(item.id + "--------" + that.pid);
				if(item.id === that.pid){
					parent = item;
					return false;
				}
			});

			/* 给父级元素设置选中与取消选中，当给父级元素设置不选中时需考虑父元素的所有子元素是否还有选中的
			，如果有则不能给父级元素取消掉 */
			if(flag){
				parent.checked = flag;
				document.getElementById(parent.id).checked = flag;
			}else{
				var allChildNotChecked = true;
				YnTree.forEach(parent.children, function (index, item){
					if(item.checked){
						allChildNotChecked = false;
						return false;
					}
				});
				if(allChildNotChecked){
					parent.checked = flag;
					document.getElementById(parent.id).checked = flag;
				}
			}
			

			if(parent.pid){
				parent.selectUp(flag);
			}

			return this;
		},
		/**
		 * 树节点选择，如果当前节点有子节点，则调用selectDown向下查找将当前子节点全部选中或不选中，
			然后调用selectUp向上查找将当前节点的所有父节点都选中或不选中
		 * @param  {boolean} flag 当前节点是否选中
		 * @return {object}      this
		 */
		select: function (flag){
			var that = this,
				input = document.getElementById(that.id),
				ynTree = this.getYnTree(this.ynTreeId);
			flag = !!flag;
			if(!that.disabled){
				that.checked = flag;
				input.checked = flag;
			}
			

			// 执行复选框改变后的回调
			ynTree.options.onchange && (YnTree.getType(ynTree.options.onchange) == "function") && ynTree.options.onchange.call(this, input, ynTree);

			/* 将树节点的查找分为两步，如果当前节点有子节点，则调用selectDown向下查找将当前子节点全部选中或不选中，
			然后调用selectUp向上查找将当前节点的所有父节点都选中或不选中 */
			if(typeof ynTree.options.checkStrictly == "undefined" || ynTree.options.checkStrictly === true){
				if(that.type == "composite"){
					this.selectDown(flag);	
				}
				if(that.pid){
					this.selectUp(flag);
				}
			}
			
			return this;
		},
		/**
		 * 设置节点不可用
		 * @param  {boolean} flag 当前节点是否不可用
		 * @return {object}      this
		 */
		disable: function (flag){
			var that = this,
				input = document.getElementById(that.id),
				ynTree = this.getYnTree(this.ynTreeId);
			flag = !!flag;

			that.disabled = flag;
			input.disabled = flag;
			
			return this;
		},
		/**
		 * 根据ID获取与当前对象关联的YnTree对象
		 * @param  {string} id YnTree对象ID
		 * @return {object}    返回YnTree对象
		 */
		getYnTree: function (id){
			var ynTree;
			if(id in ynTrees){
				ynTree = ynTrees[id];
			}
			return ynTree;
		},
		/**
		 * 设置节点展开或隐藏
		 * @param  {boolean} flag 当前节点是否展开
		 * @return {object}      this
		 */
		spread: function (flag){
			var that = this,
				curLi = document.getElementById(that.id + "_li"),
				ynTree = this.getYnTree(this.ynTreeId),
				classNameArr = curLi.className.split(" "),
				hasSpreadClass = false,
				spreadClassIndex = -1,
				hasShrinkClass = false,
				shrinkClassIndex = -1;


			// 如果是叶子节点，即没有子节点则直接返回
			if(that.type == "leaf"){
				return this;
			}

			for(var i = 0,len = classNameArr.length; i < len; i++){
				if(classNameArr[i] === classNameCfg.spread){
					hasSpreadClass = true;
					spreadClassIndex = i;
				}
				if(classNameArr[i] === classNameCfg.shrink){
					hasShrinkClass = true;
					shrinkClassIndex = i;
				}
			}

			// 如果用户未传递flag，则进行自动切换
			if(typeof flag == "undefined"){
				if(hasSpreadClass){
					flag = false;
				}else if(hasShrinkClass){
					flag = true;
				}
			}

			flag = !!flag;


			if(flag){
				if(hasSpreadClass){return this;}
				// 移除收缩节点的class
				if(hasShrinkClass){
					classNameArr.splice(shrinkClassIndex, 1);
				}
				classNameArr.push(classNameCfg.spread);
				curLi.className = classNameArr.join(" ");
			}else{
				if(hasShrinkClass){return this;}
				// 移除展开节点的class
				if(hasSpreadClass){
					classNameArr.splice(spreadClassIndex, 1);
				}
				classNameArr.push(classNameCfg.shrink);
				curLi.className = classNameArr.join(" ");
			}
			
			return this;
		}
		
	}

	window.YnTree = YnTree;
})(window, undefined);
