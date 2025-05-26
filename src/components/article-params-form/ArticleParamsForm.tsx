import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	ArticleStateType,
	fontFamilyOptions,
	fontColors,
	fontSizeOptions,
	backgroundColors,
	contentWidthArr,
	OptionType,
	defaultArticleState,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	articleStyles: ArticleStateType;
	setArticleStyles: (newStyles: ArticleStateType) => void;
	isFormOpen: boolean;
	toggleFormVisibility: () => void;
};

export const ArticleParamsForm = ({
	articleStyles,
	setArticleStyles,
	isFormOpen,
	toggleFormVisibility,
}: ArticleParamsFormProps) => {
	const [localStyles, setLocalStyles] =
		useState<ArticleStateType>(articleStyles);
	const formRef = useRef<HTMLFormElement>(null);
	const arrowButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		setLocalStyles(articleStyles);
	}, [articleStyles]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				formRef.current &&
				!formRef.current.contains(event.target as Node) &&
				arrowButtonRef.current &&
				!arrowButtonRef.current.contains(event.target as Node)
			) {
				toggleFormVisibility();
			}
		};

		if (isFormOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isFormOpen, toggleFormVisibility]);

	const handleFieldChange = (
		field: keyof ArticleStateType,
		value: OptionType
	) => {
		setLocalStyles((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleFormSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setArticleStyles(localStyles);
		toggleFormVisibility();
	};

	const handleFormReset = () => {
		setLocalStyles(defaultArticleState);
		setArticleStyles(defaultArticleState);
		toggleFormVisibility();
	};

	return (
		<>
			<ArrowButton isOpen={isFormOpen} onClick={toggleFormVisibility} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleFormSubmit}
					onReset={handleFormReset}
					ref={formRef}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>

					<Select
						title='Шрифт'
						selected={localStyles.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(selected) =>
							handleFieldChange('fontFamilyOption', selected)
						}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						selected={localStyles.fontSizeOption}
						options={fontSizeOptions}
						onChange={(selected) =>
							handleFieldChange('fontSizeOption', selected)
						}
					/>

					<Select
						title='Цвет шрифта'
						selected={localStyles.fontColor}
						options={fontColors}
						onChange={(selected) => handleFieldChange('fontColor', selected)}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						selected={localStyles.backgroundColor}
						options={backgroundColors}
						onChange={(selected) =>
							handleFieldChange('backgroundColor', selected)
						}
					/>

					<Select
						title='Ширина контента'
						selected={localStyles.contentWidth}
						options={contentWidthArr}
						onChange={(selected) => handleFieldChange('contentWidth', selected)}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
