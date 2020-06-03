(function($){
    var app={
        init:function(){    
            this.initCheckBox();         
            this.changeCartNum();
            this.isCheckedAll();
            this.deleteConfirm();
        },

        //删除
        deleteConfirm:function(){
            $('.delete').click(function(){
                var flag=confirm('您确定要删除吗?');
                return flag;
            })
        },

        //全选 
        initCheckBox(){
            //点击 全选
            $("#checkAll").click(function() {
               // 点击后 全选状态
                if (this.checked) {
                    $(":checkbox").prop("checked", true);                        
                    $.get('/changeAllCart?type=1',function(response){                   
                        if(response.success){
                            $("#allPrice").html(response.allPrice+'元');                       
                        }
                    }); 
                }else {
                    //点击后  非选中状态
                    $(":checkbox").prop("checked", false);
                    $.get('/changeAllCart?type=0',function(response){                   
                        if(response.success){
                            $("#allPrice").html(response.allPrice+'元');                       
                        }
                    }); 
                }
            });            

            //点击 单选
            const _that=this;
            $(".table_cart_list input:checkbox").click(function() {            
                _that.isCheckedAll();
                var goods_id=$(this).attr('goods_id');
                // var color=$(this).attr('color');
                //+'&color='+color
                $.get('/changeOneCart?goods_id='+goods_id,function(response){                   
                    if(response.success){
                        $("#allPrice").html(response.allPrice+'元');                       
                    }
                }); 
            });
        },
        
        //判断全选是否选择
        isCheckedAll(){
            var checkboxNum = $(".table_cart_list input:checkbox").size();//checkbox总个数
            var checkedNum = 0;  //checkbox checked=true总个数
            $(".table_cart_list input:checkbox").each(function () {  
                if($(this).prop("checked")==true){
                    checkedNum++;
                }
            });
            if(checkboxNum==checkedNum){//全选
                $("#checkAll").prop("checked",true);
            }else{//不全选
                $("#checkAll").prop("checked",false);
            }
        },
        
        //购物车 数量 增减 
        changeCartNum(){
            $('.decCart').click(function(){
                var goods_id=$(this).attr('goods_id');
                // var color=$(this).attr('color');
                //  +'&color='+color
                $.get('/decCart?goods_id='+goods_id,function(response){                   
                    if(response.success){
                        $("#allPrice").html(response.allPrice+'元');
                        $(this).siblings('.input_center').find('input').val(response.num);
                        var price= parseFloat($(this).parent().parent().siblings('.price').html()).toFixed(2);
                        var totalPrice = parseFloat(response.num*price).toFixed(2)
                        $(this).parent().parent().siblings('.totalPrice').html(totalPrice+"元");
                    }
                }.bind(this));   //注意this指向
            })

            $('.incCart').click(function(){
                var goods_id=$(this).attr('goods_id');
                // var color=$(this).attr('color');
                //+'&color='+color
                $.get('/incCart?goods_id='+goods_id,function(response){                   
                    if(response.success){
                        $("#allPrice").html(response.allPrice+'元');
                        $(this).siblings('.input_center').find('input').val(response.num);                        
                        var price= parseFloat($(this).parent().parent().siblings('.price').html()).toFixed(2);
                        var totalPrice = parseFloat(response.num*price).toFixed(2)
                        $(this).parent().parent().siblings('.totalPrice').html(totalPrice+'元');
                    }
                }.bind(this));
            })
        }
    }

    $(function(){
        app.init();
    })
    
})($)
