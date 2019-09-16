# autoScroll细节

> 知识大纲
1. autoScroll有自己的控制content的位置的机制,
    会导致content的位置与我们加载时候的位置修改冲突，体现在快速滚动后的连续加载;
2. 处理细节:
     * 在判断要加载的时候，先判断当前是否在autoScroll模式, 如果是返回;
     * 监听autoScroll结束后抛出的end事件,在来计算加载;
     * 当autoScroll滚动到最上头的时候，会有回弹，那个时候发生了加载，所以
        在要加载的时候，检测到时autoScroll,关闭掉回弹的效果,等auto scroll end事件发生了以后再打开;
     * this.scroll_view.elastic = false  
     * this.scroll_view._autoScrolling - 判断是否在自动滚动

> 练习
1. 因为autoScroll的冲突问题导致了我们用鼠标拖拽快速滚动后的bug，
    所以我们在update方法里可以判断是否自动滚动，如果是，则return
    ```
    update (dt) {
        if (this.start_index + this.PAGE_NUM * 3 < this.value_set.length &&
            this.content.y >= this.start_y + this.PAGE_NUM * 2 * this.OPT_HEIGHT) { 
            if(this.scroll_view._autoScrolling) return;
            let down_loaded = this.PAGE_NUM;
            this.start_index += down_loaded;
            if (this.start_index + this.PAGE_NUM * 3 > this.value_set.length) {
                let out_len = this.start_index + this.PAGE_NUM * 3 - this.value_set.length;
                down_loaded -= (out_len);
                this.start_index -= (out_len);
            }
            this.load_record(this.start_index);
            this.content.y -= (down_loaded * this.OPT_HEIGHT);
        }
    },
    ```
2. 优化
    1. 新写个函数**scrollview_load_record**, 把之前向下加载的代码放在里面，后续要在补上向上加载的逻辑
    2. 在update里调用scrollview_load_record
    3. 在onLoad中监听scroll_ended, 为了加上滚动结束的逻辑
    4. 新写个函数on_scroll_ended，这个函数就是在滚动结束后去调用scrollview_load_record  
    5. 完成向上加载的逻辑，参考向下加载
    6. 解决回弹效果，使用`this.scroll_view.elastic = false;` 
    7. 最终代码是
        ```
        /*
        显示[1, 100]这个数据
        (1)我们将我们滚动列表里面的每个项分成三个页
        (2)每一个页面我们制定一个数目，例如8个,根据你的scrollview的大小来决定;
        (3)总共使用的滚动列表里面的想 PAGE_NUM * 3 = 24个;
        (4)有限的项要显示 超过它数目的数据记录?
        
        */
        
        cc.Class({
            extends: cc.Component,
        
            properties: {
                OPT_HEIGHT: 80, // 每项的高度
                PAGE_NUM: 8, // 每页为8个;
                item_prefab: {
                    type: cc.Prefab,
                    default: null,
                },
        
                scroll_view: {
                    type: cc.ScrollView,
                    default: null,
                },
            },
        
            // use this for initialization
            onLoad: function () {
                this.value_set = [];
                // 如果你这里是排行榜，那么你就push排行榜的数据;
                for(var i = 1; i <= 100; i ++) {
                    this.value_set.push(i);
                }
        
                this.content = this.scroll_view.content;
                this.opt_item_set = [];
                for(var i = 0; i < this.PAGE_NUM * 3; i ++) {
                    var item = cc.instantiate(this.item_prefab);
                    this.content.addChild(item);
                    this.opt_item_set.push(item);
                }
        
                this.scroll_view.node.on("scroll-ended", this.on_scroll_ended.bind(this), this);
            },
        
            start: function() {
                this.start_y = this.content.y;
                this.start_index = 0; // 当前我们24个Item加载的 100项数据里面的起始数据记录的索引;
                this.load_record(this.start_index);
            },
        
            // 从这个索引开始，加载数据记录到我们的滚动列表里面的选项
            load_record: function(start_index) {
                this.start_index = start_index;
        
                for(var i = 0; i < this.PAGE_NUM * 3; i ++) {
                    var label = this.opt_item_set[i].getChildByName("src").getComponent(cc.Label);
                    // 显示我们的记录;
                    label.string = this.value_set[start_index + i];
                }
            },
        
            on_scroll_ended: function() {
                this.scrollveiw_load_record();
                this.scroll_view.elastic = true;
            },
        
            scrollveiw_load_record: function() {
                 // 向下加载了
                if (this.start_index + this.PAGE_NUM * 3 < this.value_set.length &&
                    this.content.y >= this.start_y + this.PAGE_NUM * 2 * this.OPT_HEIGHT) { // 动态加载
                    
                    if (this.scroll_view._autoScrolling) { // 等待这个自动滚动结束以后再做加载
                        this.scroll_view.elastic = false; // 暂时关闭回弹效果
                        return;
                    }
        
                    var down_loaded = this.PAGE_NUM;
                    this.start_index += down_loaded;
                    if (this.start_index + this.PAGE_NUM * 3 > this.value_set.length) {
                        var out_len = this.start_index + this.PAGE_NUM * 3 - this.value_set.length;
                        down_loaded -= (out_len);
                        this.start_index -= (out_len);
                    }
                    this.load_record(this.start_index);
        
                    this.content.y -= (down_loaded * this.OPT_HEIGHT);
                    return;
                }
        
                // 向上加载
                if (this.start_index > 0 && this.content.y <= this.start_y) {
                    if (this.scroll_view._autoScrolling) { // 等待这个自动滚动结束以后再做加载
                        this.scroll_view.elastic = false;
                        return;
                    }
        
                    var up_loaded = this.PAGE_NUM;
                    this.start_index -= up_loaded;
                    if (this.start_index < 0) {
                        up_loaded += this.start_index;
                        this.start_index = 0; 
                    }
                    this.load_record(this.start_index);
                    this.content.y += (up_loaded * this.OPT_HEIGHT);
                }
                // end 
            },
            // called every frame, uncomment this function to activate update callback
            update: function (dt) {
                this.scrollveiw_load_record();
            },
        });

        ```