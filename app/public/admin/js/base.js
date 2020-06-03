$(function(){
	app.init();
})

var app={
	init:function(){
		this.toggleAside();
		this.deleteConfirm();
	},

	deleteConfirm:function(){
		$('.delete').click(function(){
			var flag=confirm('您确定要删除吗?');
			return flag;
		})
	},

	resizeIframe:function(){
		var heights = document.documentElement.clientHeight-100;	
		document.getElementById('rightMain').height = heights
	},

	toggleAside:function(){
			// $('.asideul>li:nth-child(1) ul,.asideul>li:nth-child(2) ul,.asideul>li:nth-child(3) ul,.asideul>li:nth-child(4) ul,.asideul>li:nth-child(5) ul,.asideul>li:nth-child(6) ul').hide();
			$('.asideul>li:nth-child(-n+10) ul').hide()
			$('.aside h4').click(function(){
				$(this).siblings('ul').slideToggle();
			})
	},
	
	//修改状态
	changeStatus:function(el,model,attr,id){
		$.get('/admin/changeStatus',{model:model,attr:attr,id:id},function(data) {
			
			if (data.success) {
				if (el.className.indexOf('ok') != -1) {
					el.className = 'glyphicon glyphicon-remove icon-color-red'
				} else {
					el.className = 'glyphicon glyphicon-ok icon-color-green'
				}	
			}
		})
	},
	
	//修改排序
	editNum:function(el,model,attr,id){

		var val=$(el).html();

		var input=$("<input value='' />");


		//把input放在sapn里面
		$(el).html(input);

		//让input获取焦点  给input赋值
		$(input).trigger('focus').val(val);

			
		//点击input的时候阻止冒泡
		$(input).click(function(){

			return false;
		})
		//鼠标离开的时候给sapn赋值
		$(input).blur(function(){

			var num=$(this).val();

			$(el).html(num);

			// console.log(model,attr,id)


			$.get('/admin/editNum',{model:model,attr:attr,id:id,num:num},function(data) {

				console.log(data);
			})

		})




	}
}

