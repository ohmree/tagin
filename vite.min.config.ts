import { mergeConfig, UserConfigExport } from 'vite'
import { sharedConfig, pkgName } from './vite.config'
import { DeepPartial } from 'tsdef'

export default mergeConfig(sharedConfig, (<UserConfigExport>{
	build: {
		// XXX: currently only umd builds are minified: https://github.com/vitejs/vite/issues/6555
		minify: 'esbuild',
		lib: {
			fileName: (format) => `${pkgName}${format === 'es' ? '.module' : ''}.min.js`,
		},
		emptyOutDir: false,
		rollupOptions: {
			output: {
				// HACK: this won't work with more than one (s)css file.
				assetFileNames: 'tagin.min[extname]',
			},
		},
	},
}) as DeepPartial<UserConfigExport>)
