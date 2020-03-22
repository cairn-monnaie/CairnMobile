@name: [nuti::lang] ? ([name:[nuti::lang]] ? [name:[nuti::lang]] : ([name:[nuti::fallback_lang]] ? [name:[nuti::fallback_lang]] : [name])) : [name];

#cairn {
	// shield-placement: [nuti::markers3d];
	// shield-name: @name;
	// shield-size: 10;
	// shield-line-spacing: -4;
	// shield-file: url(images/cairn.png);
	// shield-face-name: @mont;
	// shield-fill: #000000;
	// shield-halo-fill: #ffffff;
	// shield-halo-rasterizer: fast;
	// shield-halo-radius: 1;
	// shield-wrap-width:70;
	// shield-text-dy: -20;

	::icon {
		marker-placement: [nuti::markers3d];
		marker-file: url(images/cairn.png);
		marker-width: 24;
		marker-height: 24;
		marker-allow-overlap: true;
		marker-clip: false;
	}
	
	::label {
		text-name: @name;
		text-face-name: @mont;
		text-placement: [nuti::markers3d];
		text-line-spacing: -1;
		text-wrap-before: true;
		text-avoid-edges: true;
		text-fill: #000000;
		text-size: 12;
		text-wrap-width: step([zoom], (15, 80), (16, 90), (18, 100));
		text-feature-id: [name];
		text-dy: 15; 
		text-halo-fill: #ffffff;
		text-halo-rasterizer: fast;
		text-halo-radius: 1;
	}
}

// #contour {
// 	[zoom>=12][ele>300],
// 	[zoom>=14][ele>200],
// 	[zoom>=16][ele>0] {
// 		line-width: 0.68;
// 		line-color: #ff0000;
// 		// line-comp-op: minus;
// 		line-opacity: 0.2;
// 		[index=5][zoom>=16],
// 		[index=10] {
// 			line-opacity: 0.3;
// 			line-width: 0.96;
// 		}
// 	}
// }