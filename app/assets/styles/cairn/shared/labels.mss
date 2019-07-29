@name: [nuti::lang] ? ([name:[nuti::lang]] ? [name:[nuti::lang]] : ([name:[nuti::fallback_lang]] ? [name:[nuti::fallback_lang]] : [name])) : [name];

#cairn {
	shield-placement: [nuti::markers3d];
	shield-name: @name;
	shield-size: 10;
	shield-line-spacing: -4;
	shield-file: url(images/cairn.png);
	shield-face-name: @mont;
	shield-fill: #000000;
	shield-halo-fill: #ffffff;
	shield-halo-rasterizer: fast;
	shield-halo-radius: 1;
	shield-wrap-width:70;
	shield-text-dy: 40;

	// ::icon {
	// 	text-placement: [nuti::markers3d];
	// 	text-name: [nuti::maki-bank];
	// 	text-size: 17;
	// 	text-face-name: @maki;
	// 	// text-opacity:0.8;
	// 	text-feature-id: [name];
	// 	text-halo-fill: #ffffff;
	// 	text-halo-rasterizer: fast;
	// 	text-halo-radius: 1;
	// 	text-fill: #5F337A;
	// }
	
	// ::label {
	// 	text-name: @name;
	// 	text-face-name: @mont;
	// 	text-placement: [nuti::markers3d];
	// 	text-line-spacing: -1;
	// 	text-wrap-before: true;
	// 	text-avoid-edges: true;
	// 	text-fill: #000000;
	// 	text-size: 10;
	// 	text-wrap-width: step([zoom], (15, 80), (16, 90), (18, 100));
	// 	text-feature-id: [name];
	// 	text-dy: 10; 
	// 	text-halo-fill: #ffffff;
	// 	text-halo-rasterizer: fast;
	// 	text-halo-radius: 1;
	// }
}
