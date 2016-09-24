/*

x jsonを読み込む
x サムネイル画像の表示、とりあえず、bxsliderで
一定量スクロールで上下移動
スワイプで上下移動
スマホ傾きで上下移動
移動すると震える

*/
;(function($){
	// WORKS用テンプレート
	var $templateWork = $('#template-work .work');
	// WORKS開始位置
	var $startWorks = $('#top'); // $('#start-works');
	// jsonのロード
	$.getJSON('data/works.json', function(data){
		$.each(data, function(index, workInfo) {
			// jsonより、WORKSを展開する。
			var $dom = $templateWork.clone();
			$dom.find('.work-title').text(workInfo.title || "");
			$dom.find('.work-description').text(workInfo.description || "");
			if (workInfo.url) {
				$dom.find('.work-url a').attr('href', workInfo.url);
			} else {
				$dom.find('.work-url').empty();
			}
			if (workInfo["thumbnail-image"]) {
				var $slider = $dom.find('.slider');
				// サムネイルの追加
				$.each(workInfo["thumbnail-image"], function(index, thumbUrl){
					var $dom = $('<li>');
					$dom.append($('<img>').attr('src', thumbUrl));
					$slider.append($dom);
				});
			}
			$startWorks.after($dom);
			// スライダーの設定
			$dom.find('.slider').bxSlider({pager: false});
		});
		// フルページの設定をする。
		$('#fullpage').fullpage({
			sectionSelector: '.card'
		});
	});
})(jQuery);
